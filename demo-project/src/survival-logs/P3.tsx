import React from "react";
import { Part, PartData } from "./Part";
import data from "./p3-data.json";

// Survival Logs — Tập 1 Part 3 "The Last Welcome".
export const DURATION = Math.ceil(data.total * 30);
export const P3: React.FC = () => <Part data={data as PartData} base="survival-logs/p3/" />;
