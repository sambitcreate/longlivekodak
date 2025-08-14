# Long Live Kodak - static server container
# Serves the app via Python's built-in HTTP server on port 8041

FROM python:3.12-alpine

# Create non-root user
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app

# Copy only required static assets
COPY kodak_frame_generator_v2.html ./
COPY style.css ./
COPY app.js ./

# Make the app accessible at /
RUN ln -s /app/kodak_frame_generator_v2.html /app/index.html \
    && chown -R app:app /app

USER app
EXPOSE 8041

CMD ["python3", "-m", "http.server", "8041", "--bind", "0.0.0.0"]
