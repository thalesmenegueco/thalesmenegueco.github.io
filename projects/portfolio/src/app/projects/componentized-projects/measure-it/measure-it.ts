import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

type Tool = 'paste' | 'calibrate' | 'measure' | 'pan';

interface Point {
  x: number;
  y: number;
}

interface Calibration {
  pxPerUnit: number;
  unit: string;
}

interface CanvasImage {
  element: HTMLImageElement;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface HistorySnapshot {
  images: Array<{
    src: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  calibration: { pxPerUnit: number; unit: string } | null;
}

interface ToolOption {
  id: Tool;
  emoji: string;
  label: string;
}

@Component({
  selector: 'app-measure-it',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './measure-it.html',
  styleUrl: './measure-it.scss',
})
export class MeasureIt implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('shell', { static: false }) shellRef!: ElementRef<HTMLDivElement>;

  readonly tools: ToolOption[] = [
    { id: 'paste', emoji: '📋', label: 'Colar imagem' },
    { id: 'calibrate', emoji: '📏', label: 'Calibrar régua' },
    { id: 'measure', emoji: '📐', label: 'Medir desenho' },
    { id: 'pan', emoji: '✋', label: 'Mover canvas' },
  ];

  tool: Tool = 'paste';
  knownDistance = 10;
  unit = 'mm';
  showGrid = true;
  showGuides = true;

  statusTitle = 'Pronto para começar';
  statusDescription = 'Pressione Ctrl+V para colar uma imagem.';

  zoomBadge = 'Zoom: 100%';
  scaleBadge = 'Escala: não calibrada';
  imageBadge = 'Imagens: 0';

  hasMeasure = false;
  measureValue = '—';
  measurePixels = '—';

  private ctx!: CanvasRenderingContext2D;
  private images: CanvasImage[] = [];
  private zoom = 1;
  private offsetX = 0;
  private offsetY = 0;
  private calibration: Calibration | null = null;
  private calibrationDraft: Point[] = [];
  private measureDraft: Point[] = [];
  private isPointerDown = false;
  private lastPointer: Point | null = null;
  private history: HistorySnapshot[] = [];

  private readonly onWheel = (event: WheelEvent): void => {
    event.preventDefault();

    const screen = this.pointerPosition(event);
    const factor = event.deltaY < 0 ? 1.12 : 0.89;

    this.setZoom(this.zoom * factor, screen);
  };

  get hasImages(): boolean {
    return this.images.length > 0;
  }

  ngAfterViewInit(): void {
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }

    this.ctx = ctx;
    this.canvasRef.nativeElement.addEventListener('wheel', this.onWheel, {
      passive: false,
    });

    this.resizeCanvas();
    this.updateBadges();
  }

  ngOnDestroy(): void {
    this.canvasRef?.nativeElement.removeEventListener('wheel', this.onWheel);
  }

  @HostListener('document:paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const items = Array.from(event.clipboardData?.items ?? []);
    const imageItem = items.find((item) => item.type.startsWith('image/'));

    if (!imageItem) {
      return;
    }

    event.preventDefault();

    const file = imageItem.getAsFile();
    if (file) {
      this.addImageFromBlob(file);
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const isUndo =
      (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z';

    if (isUndo) {
      event.preventDefault();
      this.undo();
      return;
    }

    if (event.key === 'Escape') {
      this.calibrationDraft = [];
      this.measureDraft = [];
      this.render();
      this.updateStatus(
        'Operação cancelada',
        'Selecione uma ferramenta para continuar.'
      );
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.resizeCanvas();
  }

  setTool(tool: Tool): void {
    this.tool = tool;
    this.calibrationDraft = [];
    this.measureDraft = [];

    const messages: Record<Tool, [string, string]> = {
      paste: ['Modo colar', 'Pressione Ctrl+V para adicionar uma imagem.'],
      calibrate: [
        'Modo calibrar',
        'Clique em dois pontos cuja distância você conhece.',
      ],
      measure: ['Modo medir', 'Clique em dois pontos para medir o desenho.'],
      pan: ['Modo mover', 'Arraste o canvas para navegar pela imagem.'],
    };

    this.updateStatus(...messages[tool]);
    this.render();
  }

  undo(): void {
    const previous = this.history.pop();

    if (!previous) {
      this.updateStatus(
        'Nada para desfazer',
        'O histórico de alterações está vazio.'
      );
      return;
    }

    this.images = previous.images.map((item) => {
      const image = new Image();
      image.src = item.src;

      return { ...item, element: image };
    });

    this.calibration = previous.calibration;

    this.updateBadges();
    this.render();
    this.updateStatus('Alteração desfeita', 'O canvas voltou ao estado anterior.');
  }

  resetView(): void {
    this.zoom = 1;
    this.offsetX = 0;
    this.offsetY = 0;

    this.updateBadges();
    this.render();
    this.updateStatus(
      'Visualização centralizada',
      'Zoom e posição foram restaurados.'
    );
  }

  clearCanvas(): void {
    if (!this.images.length && !this.calibration) {
      this.updateStatus('Canvas já está vazio', 'Nada para limpar.');
      return;
    }

    this.saveHistory();

    this.images = [];
    this.calibration = null;
    this.calibrationDraft = [];
    this.measureDraft = [];
    this.hasMeasure = false;

    this.updateBadges();
    this.render();
    this.updateStatus('Canvas limpo', 'Você pode colar uma nova imagem.');
  }

  zoomIn(): void {
    this.setZoom(this.zoom * 1.2);
  }

  zoomOut(): void {
    this.setZoom(this.zoom / 1.2);
  }

  onGridToggle(event: Event): void {
    this.showGrid = (event.target as HTMLInputElement).checked;
    this.render();
  }

  onGuidesToggle(event: Event): void {
    this.showGuides = (event.target as HTMLInputElement).checked;
    this.render();
  }

  onPointerDown(event: PointerEvent): void {
    const screen = this.pointerPosition(event);
    const world = this.screenToWorld(screen.x, screen.y);

    this.isPointerDown = true;
    this.lastPointer = screen;

    if (this.tool === 'calibrate') {
      if (this.calibrationDraft.length >= 2) {
        this.calibrationDraft = [];
      }

      this.calibrationDraft.push(world);

      if (this.calibrationDraft.length === 2) {
        this.finishCalibration();
      }

      this.render();
      return;
    }

    if (this.tool === 'measure') {
      if (this.measureDraft.length >= 2) {
        this.measureDraft = [];
      }

      this.measureDraft.push(world);

      if (this.measureDraft.length === 2) {
        this.finishMeasurement();
      }

      this.render();
    }
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.isPointerDown) {
      return;
    }

    if (this.tool !== 'pan') {
      return;
    }

    const screen = this.pointerPosition(event);
    if (!this.lastPointer) {
      return;
    }

    this.offsetX += screen.x - this.lastPointer.x;
    this.offsetY += screen.y - this.lastPointer.y;
    this.lastPointer = screen;

    this.render();
  }

  onPointerUp(): void {
    this.isPointerDown = false;
  }

  private addImageFromBlob(blob: Blob): void {
    if (!blob || !blob.type.startsWith('image/')) {
      this.updateStatus(
        'Formato não reconhecido',
        'Cole uma imagem ou captura de tela válida.'
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        this.saveHistory();

        const { width: canvasWidth, height: canvasHeight } =
          this.getCanvasSize();
        const maxWidth = canvasWidth * 0.72;
        const maxHeight = canvasHeight * 0.72;
        const ratio = Math.min(
          1,
          maxWidth / image.naturalWidth,
          maxHeight / image.naturalHeight
        );

        const width = image.naturalWidth * ratio;
        const height = image.naturalHeight * ratio;
        const worldCenter = this.screenToWorld(
          canvasWidth / 2,
          canvasHeight / 2
        );

        this.images.push({
          element: image,
          src: reader.result as string,
          x: worldCenter.x - width / 2,
          y: worldCenter.y - height / 2,
          width,
          height,
        });

        this.offsetX = 0;
        this.offsetY = 0;

        this.updateBadges();
        this.render();
        this.updateStatus(
          'Imagem adicionada',
          'Você pode colar outras imagens para trabalhar com várias referências.'
        );
      };

      image.src = reader.result as string;
    };

    reader.readAsDataURL(blob);
  }

  private finishCalibration(): void {
    const px = this.distance(this.calibrationDraft[0], this.calibrationDraft[1]);
    const known = Number(this.knownDistance);
    const unit = String(this.unit ?? '').trim() || 'mm';

    if (!Number.isFinite(known) || known <= 0 || px <= 0) {
      this.updateStatus(
        'Dados inválidos',
        'Informe uma distância conhecida maior que zero.'
      );
      this.calibrationDraft = [];
      return;
    }

    this.saveHistory();
    this.calibration = { pxPerUnit: px / known, unit };

    this.updateBadges();
    this.updateStatus(
      'Régua calibrada',
      `${px.toFixed(1)} px correspondem a ${known} ${unit}.`
    );

    this.calibrationDraft = [];
  }

  private finishMeasurement(): void {
    const px = this.distance(this.measureDraft[0], this.measureDraft[1]);

    if (this.calibration) {
      const value = px / this.calibration.pxPerUnit;
      const unit = this.calibration.unit;

      this.measureValue = `${value.toFixed(2)} ${unit}`;
      this.measurePixels = `Distância no desenho: ${px.toFixed(2)} px`;
      this.hasMeasure = true;

      this.updateStatus(
        'Medida calculada',
        `A distância selecionada equivale a ${value.toFixed(2)} ${unit}.`
      );
    } else {
      this.measureValue = `${px.toFixed(2)} px`;
      this.measurePixels = 'Calibre a régua para obter uma medida real.';
      this.hasMeasure = true;

      this.updateStatus(
        'Medida em pixels',
        'Calibre a régua para converter pixels em uma unidade real.'
      );
    }
  }

  private setZoom(nextZoom: number, center: Point | null = null): void {
    const oldZoom = this.zoom;
    const newZoom = Math.min(8, Math.max(0.15, nextZoom));

    if (center) {
      const worldPoint = this.screenToWorld(center.x, center.y);

      this.zoom = newZoom;
      this.offsetX = center.x - worldPoint.x * newZoom;
      this.offsetY = center.y - worldPoint.y * newZoom;
    } else {
      const { width, height } = this.getCanvasSize();
      const canvasCenter = { x: width / 2, y: height / 2 };
      const worldPoint = this.screenToWorld(canvasCenter.x, canvasCenter.y);

      this.zoom = newZoom;
      this.offsetX = canvasCenter.x - worldPoint.x * newZoom;
      this.offsetY = canvasCenter.y - worldPoint.y * newZoom;
    }

    if (oldZoom !== this.zoom) {
      this.updateBadges();
      this.render();
    }
  }

  private saveHistory(): void {
    this.history.push({
      images: this.images.map((image) => ({
        src: image.src,
        x: image.x,
        y: image.y,
        width: image.width,
        height: image.height,
      })),
      calibration: this.calibration
        ? {
            pxPerUnit: this.calibration.pxPerUnit,
            unit: this.calibration.unit,
          }
        : null,
    });

    if (this.history.length > 30) {
      this.history.shift();
    }
  }

  private updateStatus(title: string, description: string): void {
    this.statusTitle = title;
    this.statusDescription = description;
  }

  private updateBadges(): void {
    this.zoomBadge = `Zoom: ${Math.round(this.zoom * 100)}%`;
    this.imageBadge = `Imagens: ${this.images.length}`;

    if (this.calibration) {
      this.scaleBadge = `Escala: ${this.calibration.pxPerUnit.toFixed(
        2
      )} px/${this.calibration.unit}`;
    } else {
      this.scaleBadge = 'Escala: não calibrada';
    }
  }

  private resizeCanvas(): void {
    if (!this.shellRef || !this.canvasRef || !this.ctx) {
      return;
    }

    const rect = this.shellRef.nativeElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const canvas = this.canvasRef.nativeElement;

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.render();
  }

  private getCanvasSize(): { width: number; height: number } {
    const rect = this.shellRef.nativeElement.getBoundingClientRect();

    return { width: rect.width, height: rect.height };
  }

  private pointerPosition(event: { clientX: number; clientY: number }): Point {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  private screenToWorld(x: number, y: number): Point {
    return {
      x: (x - this.offsetX) / this.zoom,
      y: (y - this.offsetY) / this.zoom,
    };
  }

  private worldToScreen(x: number, y: number): Point {
    return {
      x: x * this.zoom + this.offsetX,
      y: y * this.zoom + this.offsetY,
    };
  }

  private distance(a: Point, b: Point): number {
    return Math.hypot(b.x - a.x, b.y - a.y);
  }

  private render(): void {
    const { width, height } = this.getCanvasSize();

    this.ctx.clearRect(0, 0, width, height);
    this.drawBackground(width, height);
    this.drawImages();
    this.drawGuides(width, height);

    if (this.calibrationDraft.length === 2) {
      const px = this.distance(
        this.calibrationDraft[0],
        this.calibrationDraft[1]
      );

      this.drawLine(
        this.calibrationDraft[0],
        this.calibrationDraft[1],
        '#f4a261',
        `Calibração: ${px.toFixed(1)} px`
      );
    }

    if (this.measureDraft.length === 2) {
      const px = this.distance(this.measureDraft[0], this.measureDraft[1]);
      const label = this.calibration
        ? `${(px / this.calibration.pxPerUnit).toFixed(2)} ${
            this.calibration.unit
          }`
        : `${px.toFixed(1)} px`;

      this.drawLine(this.measureDraft[0], this.measureDraft[1], '#2a9d8f', label);
    }

    this.drawRulers(width, height);
  }

  private drawBackground(width: number, height: number): void {
    this.ctx.fillStyle = '#f5fbfa';
    this.ctx.fillRect(0, 0, width, height);

    if (!this.showGrid) {
      return;
    }

    const gridSize = 25 * this.zoom;
    const startX = ((this.offsetX % gridSize) + gridSize) % gridSize;
    const startY = ((this.offsetY % gridSize) + gridSize) % gridSize;

    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(42, 157, 143, 0.12)';
    this.ctx.lineWidth = 1;

    for (let x = startX; x < width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
      this.ctx.stroke();
    }

    for (let y = startY; y < height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  private drawGuides(width: number, height: number): void {
    if (!this.showGuides) {
      return;
    }

    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(231, 111, 81, 0.27)';
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([5, 5]);

    this.ctx.beginPath();
    this.ctx.moveTo(width / 2, 0);
    this.ctx.lineTo(width / 2, height);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(0, height / 2);
    this.ctx.lineTo(width, height / 2);
    this.ctx.stroke();

    this.ctx.restore();
  }

  private drawImages(): void {
    this.images.forEach((image) => {
      const topLeft = this.worldToScreen(image.x, image.y);

      this.ctx.save();
      this.ctx.globalAlpha = 0.98;
      this.ctx.drawImage(
        image.element,
        topLeft.x,
        topLeft.y,
        image.width * this.zoom,
        image.height * this.zoom
      );

      this.ctx.strokeStyle = 'rgba(42, 157, 143, 0.42)';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(
        topLeft.x,
        topLeft.y,
        image.width * this.zoom,
        image.height * this.zoom
      );
      this.ctx.restore();
    });
  }

  private drawPoint(point: Point, color = '#e76f51'): void {
    const screen = this.worldToScreen(point.x, point.y);

    this.ctx.save();
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(screen.x, screen.y, 6, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.restore();
  }

  private drawLine(a: Point, b: Point, color = '#e76f51', label = ''): void {
    const start = this.worldToScreen(a.x, a.y);
    const end = this.worldToScreen(b.x, b.y);

    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 3;
    this.ctx.setLineDash([9, 6]);

    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.stroke();

    this.ctx.setLineDash([]);
    this.drawPoint(a, color);
    this.drawPoint(b, color);

    if (label) {
      const middleX = (start.x + end.x) / 2;
      const middleY = (start.y + end.y) / 2;

      this.ctx.font = '700 13px system-ui';
      const textWidth = this.ctx.measureText(label).width;

      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
      this.ctx.beginPath();
      this.ctx.roundRect(
        middleX - textWidth / 2 - 8,
        middleY - 23,
        textWidth + 16,
        25,
        8
      );
      this.ctx.fill();

      this.ctx.fillStyle = color;
      this.ctx.fillText(label, middleX - textWidth / 2, middleY - 6);
    }

    this.ctx.restore();
  }

  private drawRulers(width: number, height: number): void {
    const rulerSize = 28;

    this.ctx.save();
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    this.ctx.fillRect(0, 0, width, rulerSize);
    this.ctx.fillRect(0, 0, rulerSize, height);

    this.ctx.strokeStyle = 'rgba(42, 157, 143, 0.35)';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(0, 0, width, rulerSize);
    this.ctx.strokeRect(0, 0, rulerSize, height);

    this.ctx.fillStyle = '#4b7777';
    this.ctx.font = '10px system-ui';

    const worldStep = this.chooseRulerStep();
    const screenStep = worldStep * this.zoom;

    if (screenStep > 14) {
      const firstWorldX =
        Math.floor(-this.offsetX / this.zoom / worldStep) * worldStep;
      const lastWorldX = (width - this.offsetX) / this.zoom;

      for (let worldX = firstWorldX; worldX <= lastWorldX; worldX += worldStep) {
        const screenX = this.worldToScreen(worldX, 0).x;

        if (screenX < rulerSize || screenX > width) {
          continue;
        }

        this.ctx.beginPath();
        this.ctx.moveTo(screenX, rulerSize - 8);
        this.ctx.lineTo(screenX, rulerSize);
        this.ctx.stroke();

        this.ctx.fillText(String(Math.round(worldX)), screenX + 3, 12);
      }

      const firstWorldY =
        Math.floor(-this.offsetY / this.zoom / worldStep) * worldStep;
      const lastWorldY = (height - this.offsetY) / this.zoom;

      for (let worldY = firstWorldY; worldY <= lastWorldY; worldY += worldStep) {
        const screenY = this.worldToScreen(0, worldY).y;

        if (screenY < rulerSize || screenY > height) {
          continue;
        }

        this.ctx.beginPath();
        this.ctx.moveTo(rulerSize - 8, screenY);
        this.ctx.lineTo(rulerSize, screenY);
        this.ctx.stroke();

        this.ctx.save();
        this.ctx.translate(12, screenY - 3);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText(String(Math.round(worldY)), 0, 0);
        this.ctx.restore();
      }
    }

    this.ctx.restore();
  }

  private chooseRulerStep(): number {
    if (!this.calibration) {
      return 50;
    }

    const preferredPixels = 80;
    const raw = preferredPixels / this.zoom;
    const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
    const normalized = raw / magnitude;

    let factor = 1;
    if (normalized >= 5) {
      factor = 5;
    } else if (normalized >= 2) {
      factor = 2;
    }

    return factor * magnitude;
  }
}
