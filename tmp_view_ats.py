import re

with open("src/components/cv-templates.tsx", "r") as f:
    lines = f.readlines()

def print_block(name, start_line):
    print(f"--- {name} ---")
    for i in range(start_line - 1, start_line + 25):
        if i < len(lines):
            print(f"{i+1}: {lines[i].strip()}")

print_block("ATSClassic", 1893)
print_block("HarvardStandard", 2246)
print_block("ATSExecutive", 2465)
