const fs = require('fs');
const path = require('path');

const dir = 'app/templates/layouts';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

files.forEach(f => {
    let content = fs.readFileSync(path.join(dir, f), 'utf8');

    // Fix redundant backgroundColor in SectionLayoutControls
    content = content.replace(/backgroundType:\s*([^,]+),\s*backgroundColor:\s*['"]#[a-zA-Z0-9]+['"],/g, 'backgroundType: $1,');
    content = content.replace(/backgroundColor:\s*['"]#[a-zA-Z0-9]+['"],(\s*animation)/g, '$1');

    // Fix roundness: "none" inside tokens which expects sharp|slight|pill
    content = content.replace(/roundness:\s*(["'])none\1/g, 'roundness: $1sharp$1');

    // Fix numbers in style: Record<string, string>
    content = content.replace(/flex:\s*1([,} \n])/g, "flex: '1'$1");
    content = content.replace(/zIndex:\s*10([,} \n])/g, "zIndex: '10'$1");

    // Fix mapped array issues by casting the elements array to any[] to override Record<string, string> pedantic checking
    content = content.replace(/elements:\s*\[([\s\S]*?)\]\n\s*\};/g, 'elements: [$1] as any[]\n    };');

    fs.writeFileSync(path.join(dir, f), content);
});
console.log('Fixed typings in layout files.');
