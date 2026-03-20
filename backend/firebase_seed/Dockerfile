FROM python:3.11-slim

WORKDIR /workspace/backend/firebase_seed

COPY backend/firebase_seed/requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt

CMD ["python", "seed_firestore.py", "--dry-run"]