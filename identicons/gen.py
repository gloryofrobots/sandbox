# Import the libraries.
import pydenticon
import hashlib

# Set-up a list of foreground colours (taken from Sigil).
foreground = [ "rgb(45,79,255)",
               "rgb(254,180,44)",
               "rgb(226,121,234)",
               "rgb(30,179,253)",
               "rgb(232,77,65)",
               "rgb(49,203,115)",
               "rgb(141,69,170)" ]

# Set-up a background colour (taken from Sigil).
background = "rgb(224,224,224)"

# Instantiate a generator that will create 5x5 block identicons using SHA1
# digest.
generator = pydenticon.Generator(5, 5, digest=hashlib.sha1,
                                 foreground=foreground, background=background)

# Generate same identicon in three different formats.
identicon_png = generator.generate("john@example.com", 200, 200,
                                   output_format="png")

# Identicon can be easily saved to a file.
f = open("sample.png", "wb")
f.write(identicon_png)
f.close()
