import { Plugin, Notice } from 'obsidian';
import { freeSeoAudit, fullSeoAudit } from './seo-audit'; // Import audit functions

export default class SeoAuditPlugin extends Plugin {
  async onload() {
    console.log('loading obsidian-seo-audit plugin');

    // Add ribbon icon
    const ribbonIconEl = this.addRibbonIcon('search', 'SEO Audit', (evt) => {
      new Notice('SEO Audit Plugin is running!');
    });
    ribbonIconEl.addClass('obsidian-seo-audit-ribbon-class');

    // Add command
    this.addCommand({
      id: 'run-seo-audit',
      name: 'Run SEO Audit',
      callback: async () => { // Make callback async
        const activeFile = this.app.workspace.getActiveFile();
        if (!activeFile) {
          new Notice('No active file!');
          return;
        }

        const fileContent = await this.app.vault.read(activeFile);
        const auditResult = await freeSeoAudit("https://www.example.com"); // Dummy URL for now, testing freeSeoAudit
        console.log("SEO Audit Result:", auditResult); // Log result to console for now
        new Notice('SEO Audit completed. Check console for results.'); // Notify user
      }
    });
  }

  onunload() {
    console.log('unloading obsidian-seo-audit plugin');
  }
}
