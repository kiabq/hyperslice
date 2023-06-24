import type { Pool } from "pg";

async function checkAlias(pool: Pool, url: string, code: string) {
    return await pool.query(`SELECT * FROM alias WHERE alias = '${code}'`)
        .then((result) => {
            const rows = result.rows;

            if (rows.length > 0) {
                throw {
                    name: "DuplicateError",
                    error: "a duplicate alias was found"
                };
            }
        })
        .catch((error) => {
            if (error.routine !== "errorMissingColumn" && error.name === "DuplicateError") {
                createCode(pool, url);
            }
        })
}

async function createCode(pool: Pool, url: string) {
    const chars = "abcdefghijklmnopqrstuvwrxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";

    try {
        for (let i = 0; i < 6; i++) {
            const char = Math.floor(Math.random() * 62);
            code += chars.charAt(char);
        }

        await checkAlias(pool, url, code);

        return await pool.query(`SELECT a.alias FROM alias a INNER JOIN links l ON l.id = a.link_id WHERE l.link = '${url}'`)
            .then((result: any) => {
                const rows = result.rows;

                if (rows.length > 0) {
                    code = rows[0].alias;
                } else {
                    pool.query(`INSERT INTO alias(link_id, alias) VALUES ((SELECT links.id FROM links WHERE links.link = '${url}'), '${code}')`);
                }

                return code;
            })
    } catch (error) {
        console.log(error);
    }
}

async function fetchCode(pool: Pool, code: string) {
    return await pool.query(`SELECT l.link FROM links l LEFT JOIN alias ON alias.link_id = l.id WHERE alias = '${code}'`)
        .then((result) => {
            const rows = result.rows;
            if (rows.length > 0) {
                return rows[0].link as string;
            } else {
                throw {
                    name: "NotFound",
                    error: "no link could be found for this alias"
                }
            }
        })
        .catch((error) => {
            console.log(error);
        })
}

export async function encode(pool: Pool, url: string) {
    const code = await createCode(pool, url);
    return code;
}

export async function decode(pool: Pool, code: string) {
    return await fetchCode(pool, code);
}