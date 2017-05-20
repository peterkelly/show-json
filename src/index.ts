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

import { table } from "./table";

const fields = ["id", "name", "age", "occupation.name", "occupation.since"];

const data = [
    {
        id: 1,
        name: "Fred Williams",
        age: 37,
        occupation: {
            name: "Plumber",
            since: 1996,
        },
    },
    {
        id: 2,
        name: "Joe Smith",
        age: 40,
        occupation: {
            name: "Accountant",
            since: 1998,
        },
    },
    {
        id: 3,
        name: "Mary Simpson",
        age: 50,
        occupation: {
            name: "Marketing executive",
            since: 1989,
        },
    },
];

function getPath(obj: any, path: string) {
    const components = path.split(".");
    for (const component of components) {
        if ((typeof(obj) !== "object") && (obj !== null))
            return obj;
        obj = obj[component];
    }
    return obj;
}

function makeRows(fields: string[], data: any[]): any[] {
    const rows: any[] = [];
    for (const element of data) {
        const row: string[] = [];
        for (const field of fields) {
            const value = getPath(element, field);
            if (value != null)
                row.push(value);
            else
                row.push("");
        }
        rows.push(row);
    }
    return rows;
}

console.log(table(fields, makeRows(fields, data)));
