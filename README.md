# Staj Takip Merkezi / Internship Application Tracker

FastAPI ile hazırlanmış, staj ve iş başvurularını tek bir ekrandan yönetmeye yarayan full-stack web uygulaması. API ve modern Türkçe arayüz aynı uygulama içinde sunulur.

**English:** A FastAPI full-stack web app for tracking internship and job applications through a REST API and a modern Turkish user interface.

## Özellikler

- Başvuru oluşturma, listeleme, güncelleme ve silme (CRUD)
- Duruma göre filtreleme: Kaydedildi, Başvuruldu, Görüşme, Teklif, Olumsuz
- Canlı sayaçlar ve responsive arayüz
- Otomatik Swagger/OpenAPI dokümantasyonu

## Teknolojiler

Python, FastAPI, Uvicorn, Pydantic, HTML, CSS ve vanilla JavaScript.

## Çalıştırma

```bash
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Tarayıcıda `http://127.0.0.1:8000` adresini aç. API dokümantasyonu: `http://127.0.0.1:8000/docs`.

## Not

Bu portföy sürümünde başvurular bellek içinde tutulur; uygulama kapatıldığında sıfırlanır. Kalıcı kullanım için SQLite/PostgreSQL, kullanıcı girişi ve test katmanı eklenebilir.
