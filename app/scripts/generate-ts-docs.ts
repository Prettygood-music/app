import {
	Project,
	FunctionDeclaration,
	MethodDeclaration,
	ConstructorDeclaration,
	ClassDeclaration,
	InterfaceDeclaration,
	TypeAliasDeclaration,
	Node
} from 'ts-morph';
import path from 'node:path';
import fs from 'node:fs';

const project = new Project({
	tsConfigFilePath: 'tsconfig.json'
});

const sourceFiles = project.getSourceFiles('src/**/*.ts');

let output = '# TypeScript Signatures\n\n';

for (const sourceFile of sourceFiles) {
	const relativePath = path.relative(process.cwd(), sourceFile.getFilePath());
	output += `## ${relativePath}\n\n`;

	const exportedDeclarations = sourceFile.getExportedDeclarations();

	for (const [name, declarations] of exportedDeclarations) {
		for (const declaration of declarations) {
			let signature = '';
			let docs = '';

			// Safely get JSDocs if available
			//if (typeof declaration.getJsDocs === 'function') {
			if ('getJsDocs' in declaration) {
				docs = declaration
					.getJsDocs()
					.map((doc) => doc.getComment())
					.filter(Boolean)
					.join('\n');
			}

			// Signature Extraction
			if (Node.isJSDocable(declaration) || Node.isNameable(declaration)) {
				// For these node types we already handled docs above
			} else if (
				Node.isPropertySignature(declaration) ||
				Node.isMethodSignature(declaration) ||
				Node.isConstructSignatureDeclaration(declaration) ||
				Node.isCallSignatureDeclaration(declaration)
			) {
				// For property/method signatures in interfaces, try to get their docs
				const jsDocComments = declaration
					.getLeadingCommentRanges()
					.filter((comment) => comment.getText().startsWith('/**'))
					.map((comment) => {
						const text = comment.getText();
						return text.substring(3, text.length - 2).trim();
					})
					.join('\n');

				if (jsDocComments) {
					docs = jsDocComments;
				}
			}

			// Signature Extraction
			if (Node.isFunctionDeclaration(declaration)) {
				signature = declaration.getSignature().getDeclaration().getText();
			} else if (Node.isClassDeclaration(declaration)) {
				signature = `class ${name}`;
			} else if (Node.isInterfaceDeclaration(declaration)) {
				signature = `interface ${name} ${declaration.getType().getText()}`;
			} else if (Node.isTypeAliasDeclaration(declaration)) {
				signature = `type ${name} = ${declaration.getType().getText()}`;
			} else {
				signature = declaration.getText().split('{')[0].trim(); // fallback
			}

			// Append
			if (docs) {
				output += `${docs}\n\n`;
			}

			output += '```ts\n' + signature + '\n```\n\n';
		}
	}

	output += '---\n\n';
}

fs.writeFileSync('llms.txt', output, 'utf8');
console.log('llms.txt generated.');
