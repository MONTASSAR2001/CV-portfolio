import re

with open("src/components/cv-templates.tsx", "r") as f:
    content = f.read()

# 1. Restore text for Linkedin
# Find: <a ...><Linkedin size={XX} />\n</a> or similar
# Replace with: <a ...><Linkedin size={XX} /> <span className="ml-1">{p.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}</span></a>

def fix_linkedin(m):
    # m.group(1) is the <a ... >
    # m.group(2) is the icon <Linkedin ... />
    return f'{m.group(1)}{m.group(2)} <span className="ml-1">{{p.linkedin.replace(/^https?:\\/\\/(www\\.)?/, "").replace(/\\/$/, "")}}</span></a>'

content = re.sub(r'(<a[^>]*href=\{p\.linkedin[^>]*>)\s*(<Linkedin[^>]*>)\s*</a>', fix_linkedin, content)

# 2. Restore text for Github
def fix_github(m):
    return f'{m.group(1)}{m.group(2)} <span className="ml-1">{{p.github.replace(/^https?:\\/\\/(www\\.)?(github\\.com\\/)?/, "").replace(/\\/$/, "")}}</span></a>'

content = re.sub(r'(<a[^>]*href=\{p\.github[^>]*>)\s*(<Github[^>]*>)\s*</a>', fix_github, content)

# 3. Restore text for Portfolio
def fix_portfolio(m):
    return f'{m.group(1)}{m.group(2)} <span className="ml-1">{{p.portfolioUrl.replace(/^https?:\\/\\/(www\\.)?/, "").replace(/\\/$/, "")}}</span></a>'

content = re.sub(r'(<a[^>]*href=\{p\.portfolioUrl[^>]*>)\s*(<Globe[^>]*>)\s*</a>', fix_portfolio, content)

with open("src/components/cv-templates.tsx", "w") as f:
    f.write(content)
