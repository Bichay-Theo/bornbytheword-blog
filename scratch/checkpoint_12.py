import os

plan_path = r"C:\Users\Boaz\Desktop\Penal_Substitution_Plan.md"
summary = """
### State Checkpointing (Article 12: Reconciliation 1)
- **Theological State Summary:** 
  - **Conclusions:** Established that Reconciliation (Katallasso) is initiated unilaterally by God, breaking the pagan concept of humans appeasing a reluctant deity. Clarified Double Imputation: Christ absorbed our legal standing as enemies, while we received His perfect righteousness (Active & Passive obedience) entirely forensically, giving us full access to the throne of grace.
  - **Key Verses Analysed:** 2 Cor 5:18-21 (The Great Exchange), Colossians 1:19-22 (Double Enmity and its removal).
  - **Terms Solidified:** Katallasso (المصالحة كتدخل من الله), Double Imputation (الاحتساب المزدوج).

"""

if os.path.exists(plan_path):
    with open(plan_path, "a", encoding="utf-8") as f:
        f.write(summary)
    print("State checkpoint added to Plan.")
else:
    print("Plan file not found.")
