from django.core.management.base import BaseCommand
from api.models import Wilaya, SubDivision, Commune
import os
import csv
class Command(BaseCommand):
    help = "Import Wilaya, Subdivision, and Commune data from CSV files into the database"

    def handle(self, *args, **kwargs):
        base_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../data")

        # Import Wilayas
        wilaya_file = os.path.join(base_path, "wilaya.csv")
        if os.path.exists(wilaya_file):
            self.stdout.write(self.style.SUCCESS(f"Importing {wilaya_file}..."))
            with open(wilaya_file, "r", encoding="utf-8" , errors="replace") as file:
                reader = csv.reader(file)
                next(reader)  # Skip header
                for row in reader:
                    Wilaya.objects.get_or_create(id=row[0], nom=row[1])  # Mapping CSV columns to model fields
            self.stdout.write(self.style.SUCCESS("Wilayas imported successfully!"))

        # Import Subdivisions
        subdivision_file = os.path.join(base_path, "subdivision.csv")
        if os.path.exists(subdivision_file):
            self.stdout.write(self.style.SUCCESS(f"Importing {subdivision_file}..."))
            with open(subdivision_file, "r", encoding="utf-8",errors="replace") as file:
                reader = csv.reader(file)
                next(reader)  # Skip header
                for row in reader:
                    wilaya = Wilaya.objects.get(id=row[2])  # Ensure the Wilaya exists
                    SubDivision.objects.get_or_create(id=row[0], nom=row[1], wilaya=wilaya)
            self.stdout.write(self.style.SUCCESS("Subdivisions imported successfully!"))

        # Import Communes
        commune_file = os.path.join(base_path, "commune.csv")
        if os.path.exists(commune_file):
            self.stdout.write(self.style.SUCCESS(f"Importing {commune_file}..."))
            with open(commune_file, "r", encoding="utf-8",errors="replace") as file:
                reader = csv.reader(file)
                next(reader)  # Skip header
                for row in reader:
                    subdivision = SubDivision.objects.get(id=row[2])  # Ensure the Subdivision exists
                    Commune.objects.get_or_create(id=row[0], nom=row[1], subdivision=subdivision)
            self.stdout.write(self.style.SUCCESS("Communes imported successfully!"))

