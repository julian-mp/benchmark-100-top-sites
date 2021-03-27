# Benchmark 100 Top Sites 🏋️📈

This is a benchmark to pull the 100 top websites as ranked by [Moz](https://moz.com/top500), returning their HTTP status codes

The comparison is between Node.js and Golang using Promise.all() vs Go Routines (Concurrency) in Golang

# How to run

## Node
```bigquery
cd node
ts-node './src/index.ts'
```

## Go
```bigquery
cd go
go run main.go
```