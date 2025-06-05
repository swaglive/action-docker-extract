# action-docker-extract

Extract file(s) from a Docker image in your GitHub Actions workflow.

## Build

```bash
npx ncc build src/index.js -o dist
```

## Usage

Add this action to your GitHub Actions workflow:

```yaml
- name: Extract files from Docker image
  id: artifacts
  uses: swaglive/action-docker-extract@v2.0.2
  with:
    image: node:20-alpine  # Example: Use a specific Docker image
    sources: dist/         # Example: Extract files from dist/ directory

- name: Upload Artifacts
  uses: actions/upload-artifact@v4
  with:
    name: extracted-files  # Example: Name for the artifact
    path: ${{ steps.artifacts.outputs.destination }}
```

## Inputs

| Name         | Description                                               | Required | Default        |
|--------------|-----------------------------------------------------------|----------|----------------|
| image        | Docker image to extract files from                        | Yes      |                |
| sources      | Path(s) to file or directory inside the image             | Yes      |                |
| destination  | Destination path for the extracted files                  | Yes      | dist           |
| platform     | Platform for docker create/pull                           | No       | linux/amd64    |
| cleanup      | Remove the container after extracting files               | No       | true           |
| follow-link  | Always follow symbolic links in `sources`                 | No       | false          |

## Outputs

| Name         | Description                        |
|--------------|------------------------------------|
| destination  | The path where files are extracted |

## Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Build the action:
   ```bash
   npx ncc build src/index.js -o dist
   ```
