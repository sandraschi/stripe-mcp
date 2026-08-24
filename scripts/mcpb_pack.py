import json
import shutil
import sys
from pathlib import Path


def main():
    root = Path(__file__).parent.parent.resolve()
    mcpb_src = root / "mcpb" / "src"
    src = root / "src"
    prompts_dir = root / "assets" / "prompts"

    print("Verifying MCPB 3-4-100 Prompts...")
    sys_prompt = (prompts_dir / "system.md").read_text(encoding="utf-8")
    user_prompt = (prompts_dir / "user.md").read_text(encoding="utf-8")
    examples = json.loads((prompts_dir / "examples.json").read_text(encoding="utf-8"))

    sys_words = len(sys_prompt.split())
    user_words = len(user_prompt.split())
    ex_count = len(examples)

    print(f"System Prompt Words: {sys_words} (Target >= 3000)")
    print(f"User Prompt Words: {user_words} (Target >= 4000)")
    print(f"Examples Count: {ex_count} (Target >= 100)")

    if sys_words < 3000 or user_words < 4000 or ex_count < 100:
        print("ERROR: MCPB 3-4-100 prompt verification failed!")
        sys.exit(1)

    print("Fresh wipe & recopy src/ -> mcpb/src/...")
    if mcpb_src.exists():
        shutil.rmtree(mcpb_src)
    shutil.copytree(src, mcpb_src)

    print("MCPB packaging staging ready.")

if __name__ == "__main__":
    main()
