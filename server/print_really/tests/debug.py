import aspose.words as aw

# Load the document from the disc.
doc = aw.Document("input.docx")

# Save the document to HTML format.
doc.save("output.pdf")

