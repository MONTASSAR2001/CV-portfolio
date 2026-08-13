import re

with open("src/components/cv-templates.tsx", "r") as f:
    content = f.read()

# The current regex for github is:
# p.github.replace(/^https?:\/\/(www\.)?(github\.com\/)?/, "").replace(/\/$/, "")
# We want to change it to:
# p.github.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")

# The simplest way is to literally replace the string
old_str = r'p.github.replace(/^https?:\/\/(www\.)?(github\.com\/)?/, "").replace(/\/$/, "")'
new_str = r'p.github.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")'

content = content.replace(old_str, new_str)

with open("src/components/cv-templates.tsx", "w") as f:
    f.write(content)
