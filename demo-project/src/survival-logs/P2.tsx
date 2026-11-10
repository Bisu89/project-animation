import React from "react";
import { Part, PartData } from "./Part";
import data from "./p2-data.json";

// Survival Logs — Tập 1 Part 2 "I Locked Her In".
export const DURATION = Math.ceil(data.total * 30);
export const P2: React.FC = () => <Part data={data as PartData} base="survival-logs/p2/" />;
