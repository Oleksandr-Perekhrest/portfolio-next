export type CloudBox = { width: number; height: number };
export type CloudPlacement = { x: number; y: number };
export type CloudLayoutResult = { placements: CloudPlacement[]; fits: boolean };

type Area = { width: number; height: number };
type Options = { gap?: number; step?: number };

/**
 * Places boxes in an Archimedean spiral centered in `area`.
 *
 * Spiral formula: r = a * θ, where a = step / (2π). Each candidate angle
 * advances by `options.step` radians (default 0.2). The spiral is stretched
 * horizontally by the area's aspect ratio (cx * aspectRatio, cy * 1) so the
 * cloud fills wide viewports instead of collapsing into a circle.
 *
 * The first box is centered exactly. Each subsequent box tries positions along
 * the spiral until it fits — meaning the box enlarged by `options.gap` (default
 * 8 px) on every side does not overlap any already-placed box and lies fully
 * inside `area`. If the spiral leaves the area before a free spot is found for
 * a box, that box is omitted and `fits: false` is returned.
 */
export function layoutCloud(
    boxes: readonly CloudBox[],
    area: Area,
    options?: Options,
): CloudLayoutResult {
    const gap = options?.gap ?? 8;
    const step = options?.step ?? 0.2;

    const placements: CloudPlacement[] = [];
    const aspectRatio = area.width / area.height;

    // Archimedean spiral coefficient: one full turn advances radius by `step` px
    const a = step / (2 * Math.PI);

    for (let i = 0; i < boxes.length; i++) {
        const box = boxes[i];
        if (box === undefined) continue;

        if (i === 0) {
            // Center the first box exactly.
            placements.push({
                x: (area.width - box.width) / 2,
                y: (area.height - box.height) / 2,
            });
            continue;
        }

        let placed = false;
        let theta = 0;

        while (true) {
            const r = a * theta;
            const cx = r * Math.cos(theta) * aspectRatio + area.width / 2;
            const cy = r * Math.sin(theta) + area.height / 2;

            const x = cx - box.width / 2;
            const y = cy - box.height / 2;

            // Stop when the spiral center has drifted fully outside the area.
            if (cx < 0 || cx > area.width || cy < 0 || cy > area.height) {
                break;
            }

            if (
                fitsInArea(x, y, box, area) &&
                noOverlap(x, y, box, placements, boxes, gap)
            ) {
                placements.push({ x, y });
                placed = true;
                break;
            }

            theta += step;
        }

        if (!placed) {
            return { placements, fits: false };
        }
    }

    return { placements, fits: true };
}

function fitsInArea(x: number, y: number, box: CloudBox, area: Area): boolean {
    return (
        x >= 0 &&
        y >= 0 &&
        x + box.width <= area.width &&
        y + box.height <= area.height
    );
}

function noOverlap(
    x: number,
    y: number,
    box: CloudBox,
    placements: CloudPlacement[],
    boxes: readonly CloudBox[],
    gap: number,
): boolean {
    for (let j = 0; j < placements.length; j++) {
        const p = placements[j];
        const b = boxes[j];
        if (p === undefined || b === undefined) continue;

        const aLeft = x - gap;
        const aRight = x + box.width + gap;
        const aTop = y - gap;
        const aBottom = y + box.height + gap;

        const bLeft = p.x;
        const bRight = p.x + b.width;
        const bTop = p.y;
        const bBottom = p.y + b.height;

        const overlaps =
            aLeft < bRight &&
            aRight > bLeft &&
            aTop < bBottom &&
            aBottom > bTop;

        if (overlaps) {
            return false;
        }
    }

    return true;
}
