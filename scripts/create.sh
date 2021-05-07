curl "http://localhost:3333/user" -X POST -v \
-H "Content-Type: application/json" \
-H "name: ${name}" \
-d '{
  "name": "Marcelo",
  "age": 42
}' \
