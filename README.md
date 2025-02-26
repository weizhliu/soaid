# SOAID (Serve open API in /docs)

A simple command-line tool to quickly view OpenAPI/Swagger documentation in `/docs` using elements.js.

## Installation

You can install the package globally:

```bash
npm install -g soaid
```

Or run it directly with npx:

```bash
npx soaid
```

## Usage

```bash
npx soaid [options]
```

### Options

- `-f, --file`: Path to the API documentation file (default: "docs/api_v1.yaml")
- `-p, --port`: Port to run the server on (default: 8081)
- `-h, --help`: Display help information
- `--version`: Display version information

### Examples

Run with default options:
```bash
npx soaid
```

Specify a custom API documentation file:
```bash
npx soaid --file path/to/openapi.yaml
```

Run on a specific port:
```bash
npx soaid --port 3000
```

## Features

- Simple zero-configuration API documentation viewer
- Supports OpenAPI/Swagger YAML and JSON files
- No need to upload your API specs to external services

## Requirements

- Node.js 14 or higher
