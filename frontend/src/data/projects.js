import { BASE_URL, getProjectPath } from './config';

export const projects = [
    {
        id: 1,
        name: "Download Effect",
        path: getProjectPath("projects/Effect-Download/index.html"),
        icon: "↓",
        description: "A circular progress bar with pause, resume, and cancel functionality.",
        reference: `${BASE_URL}/Effect-Download/index.html`
    },
    {
        id: 2,
        name: "Ripple Effect",
        path: getProjectPath("projects/Effect-Ripple/index.html"),
        icon: "💧",
        description: "A ripple animation that generates three waves with delays.",
        reference: `${BASE_URL}/Effect-Ripple/index.html`
    }
];
