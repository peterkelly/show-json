// Copyright 2017 Peter Kelly <peter@pmkelly.net>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { arrayFill, rightpad } from "./util";

const LINE_HORIZONTAL = "━";
const LINE_VERTICAL = "┃";
const LINE_TOP_LEFT_CORNER = "┏";
const LINE_TOP_RIGHT_CORNER = "┓";
const LINE_BOTTOM_LEFT_CORNER = "┗";
const LINE_BOTTOM_RIGHT_CORNER = "┛";
const LINE_LEFT_EDGE = "┣";
const LINE_RIGHT_EDGE = "┫";
const LINE_TOP_EDGE = "┳";
const LINE_BOTTOM_EDGE = "┻";
const LINE_CROSS = "╋";

export function table(colNames: string[], rowsRaw: any[][]): string {
    const rows: string[][] = [];
    for (const raw of rowsRaw) {
        rows.push(raw.map(r => "" + r));
    }
    let numCols = colNames.length;
    for (const row of rows)
        numCols = Math.max(numCols, row.length);
    const colWidths: number[] = [];
    for (let colno = 0; colno < numCols; colno++) {
        colWidths[colno] = 0;
        if (colno < colNames.length)
            colWidths[colno] = Math.max(colWidths[colno], colNames[colno].length);
        for (let rowno = 0; rowno < rows.length; rowno++) {
            if (colno < rows[rowno].length)
                colWidths[colno] = Math.max(colWidths[colno], rows[rowno][colno].length);
        }
    }

    let totalWidth = 0;
    for (const width of colWidths)
        totalWidth += width;

    const output: string[] = [];
    output.push(
        LINE_TOP_LEFT_CORNER +
        colWidths.map(w => arrayFill(new Array(w + 2), LINE_HORIZONTAL).join("")).join(LINE_TOP_EDGE) +
        LINE_TOP_RIGHT_CORNER +
        "\n"
    );

    output.push(LINE_VERTICAL);
    for (let colno = 0; colno < numCols; colno++) {
        const colName = (colno < colNames.length) ? colNames[colno] : "";
        output.push(" " + rightpad(colName, colWidths[colno]) + " ");
        output.push(LINE_VERTICAL);
    }

    output.push(
        "\n" +
        LINE_LEFT_EDGE +
        colWidths.map(w => arrayFill(new Array(w + 2), (LINE_HORIZONTAL)).join("")).join(LINE_CROSS) +
        LINE_RIGHT_EDGE +
        "\n"
    );


    for (let rowno = 0; rowno < rows.length; rowno++) {
        const row = rows[rowno];
        output.push(LINE_VERTICAL);
        for (let colno = 0; colno < numCols; colno++) {
            const data = (colno < row.length) ? row[colno] : "";
            output.push(" " + rightpad(data, colWidths[colno]) + " ");
            output.push(LINE_VERTICAL);
        }
        if (rowno + 1 < rows.length)
            output.push("\n");
    }

    output.push(
        "\n" +
        LINE_BOTTOM_LEFT_CORNER +
        colWidths.map(w => arrayFill(new Array(w + 2), LINE_HORIZONTAL).join("")).join(LINE_BOTTOM_EDGE) +
        LINE_BOTTOM_RIGHT_CORNER +
        "\n"
    );

    return output.join("").replace(/\n$/, "");
}
