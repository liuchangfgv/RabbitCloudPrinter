import aspose.words as aw

# Load the document from the disc.
doc = aw.Document("TestDocument.docx")

# Save the document to HTML format.
doc.save("output.html")

