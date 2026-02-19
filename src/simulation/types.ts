export interface Vector {
  x: number;
  y: number;
}

export interface Body {
  id: number;
  pos: Vector;
  vel: Vector;
  acc: Vector;
  mass: number;
  radius: number;
  color: string;
  trail: Vector[];
}
