import img1 from "@/assets/project-1.jpg";
import img2 from "@/assets/project-2.jpg";
import img3 from "@/assets/project-3.jpg";
import img4 from "@/assets/project-4.jpg";
import img5 from "@/assets/project-5.jpg";
import img6 from "@/assets/project-6.jpg";

export type Project = {
  id: string;
  title: string;
  year: string;
  category: string;
  color: string; // hex for 3D blob
  image: string;
  w: number;
  h: number;
};

export const DEFAULT_COLOR = "#d4a85a";

export const projects: Project[] = [
  { id: "p1", title: "Maison Solène", year: "2024", category: "Residential Architecture", color: "#c9a26b", image: img1, w: 1200, h: 1500 },
  { id: "p2", title: "Aurum I", year: "2023", category: "Sculpture", color: "#e5b658", image: img2, w: 1200, h: 900 },
  { id: "p3", title: "Villa d'Or", year: "2024", category: "Interior Architecture", color: "#d9b280", image: img3, w: 1000, h: 1300 },
  { id: "p4", title: "Ochre Study", year: "2022", category: "Painting", color: "#d97a3c", image: img4, w: 1100, h: 1400 },
  { id: "p5", title: "Pavillon d'Été", year: "2025", category: "Pavilion", color: "#eac388", image: img5, w: 1400, h: 1000 },
  { id: "p6", title: "Bronze Elegy", year: "2023", category: "Sculpture", color: "#8a6a3a", image: img6, w: 1100, h: 1500 },
];
