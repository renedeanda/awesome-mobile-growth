import fs from "node:fs";
import path from "node:path";
const root="skills/app-store-growth"; const skill=fs.readFileSync(path.join(root,"SKILL.md"),"utf8"); const bad=[];
for(const match of skill.matchAll(/`(references\/[^`]+\.md)`/g)){if(!fs.existsSync(path.join(root,match[1])))bad.push(`missing ${match[1]}`)}
const all=[];function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);else all.push(file)}}walk(root);
const forbidden=[/\/Users\//i,/iBootstrap/i,/agent-memory/i];
for(const file of all){const text=fs.readFileSync(file,"utf8");for(const rule of forbidden){if(rule.test(text)&&!file.endsWith("SKILL.md"))bad.push(`${file}: private-data boundary phrase ${rule}`)}}
if(!/^---\nname: app-store-growth\ndescription:/m.test(skill))bad.push("SKILL.md: invalid frontmatter");
if(!fs.existsSync("public/downloads/app-store-growth-v1.0.0.tgz"))bad.push("skill package was not generated");
if(bad.length){console.error(bad.join("\n"));process.exit(1)}console.log(`Skill audit passed: ${all.length} public package files and complete references.`);
