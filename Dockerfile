FROM python:3.14-slim

WORKDIR /code
ENV PYTHONUNBUFFERED=1

RUN pip install --no-cache-dir poetry
COPY pyproject.toml poetry.lock ./
RUN poetry install --no-root --without dev --extras prod
COPY src/deanscupunai ./deanscupunai
EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "deanscupunai.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
