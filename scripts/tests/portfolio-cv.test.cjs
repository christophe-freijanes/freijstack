const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = 'saas/portfolio/public';
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

for (const name of ['CV-Christophe-FREIJANES.pdf', 'CV-Christophe-FREIJANES-ATS.pdf']) {
    test('CV téléchargeable et non vide : ' + name, () => {
        const local = path.join(root, 'cv', name);
        assert.ok(fs.existsSync(local), 'PDF absent : ' + local);
        const pdf = fs.readFileSync(local);
        assert.ok(pdf.length > 10000, 'PDF incomplet : ' + name);
        assert.equal(pdf.subarray(0, 5).toString('ascii'), '%PDF-');
        assert.match(pdf.subarray(-2048).toString('ascii'), /%%EOF/);
        assert.ok(html.includes('href="cv/' + name + '"'));
        assert.ok(html.includes('download="' + name + '"'));
    });
}

test('Le CV HTML ATS reste accessible', () => {
    assert.ok(html.includes('href="pages/resume.html"'));
});
