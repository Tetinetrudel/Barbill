
export const populateEmailTemplate = async (client, date, templatePath) => {
    try {
      const template = await fs.readFile(templatePath, 'utf-8');
      const populatedTemplate = template
        .replace('{{companyName}}', client.user.name)
        .replace('{{clientName}}', client.name)
        .replace('{{billDate}}', date)
        .replace
  
      return populatedTemplate
    } catch (error) {
      console.error('Error populating email template:', error)
      return null;
    }
  }
  