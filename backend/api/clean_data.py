import pandas as pd
import django
import csv
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE","crud.settings")
django.setup()

df=pd.read_csv("api/data/wilaya.csv")
duplicates=df[df.duplicated(subset=["name"],keep=False)]
if not duplicates.empty:
    print("duplicate nom found:\n",duplicates)
else:
    print("no")


print(df[df["id"].duplicated()])

invalidrows= df[df.apply(lambda row: len(row.dropna()) != 3,axis=1)]
if not invalidrows.empty:
    print(invalidrows)
invalidId = df[~df["subdivision_id"].astype(str).str.match(r'^[0-9]+$')]
if not invalidId.empty:
    print(invalidrows)
invalidname = df[~df["name"].str.match(r"^[\wÀ-Ö-ö-ÿ' ]+$")]
if not invalidname.empty:
    print(invalidname)
    print("duplicate nom found:\n",duplicates)
