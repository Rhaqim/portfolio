interface Fruit {
  position?: number[];
  title: string;
  info: string;
}

interface Branch {
  title: string;
  position: number[];
  scale: number;
  rotation?: number[];
  color: string;
  fruits?: Fruit[];
  branches?: Branch[];
}
