export {};

declare global {
	interface CanvasRenderingContext2D {
		roundedRect(x: number, y: number, w: number, h: number, r: number): void
		strokeRoundedRect(x: number, y: number, w: number, h: number, r: number): void
		fillRoundedRect(x: number, y: number, w: number, h: number, r: number): void
	}
}