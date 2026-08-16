// Generated from factreasonmain/src/mcp/tool-definitions.ts. Do not edit by hand.
export const TOOLS = [
  {
    "name": "factreason_package_upgrade_advisory",
    "description": "Compare two exact published npm or PyPI versions and return publisher-declared registry metadata changes, including yanks, exports, module format, runtime floors, peers, and licences, with before/after evidence. Set responseFormat=\"compact\" for tokenizer-measured context savings; the backward-compatible default is \"full\". This is a read-only metered lookup; misses are never billed and API keys receive a daily free allowance. Use it for package metadata; use factreason_api_breaking_changes for a third-party HTTP API, and consult changelogs for behavioural changes.",
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": false
    },
    "inputSchema": {
      "type": "object",
      "properties": {
        "registry": {
          "type": "string",
          "enum": [
            "npm",
            "pypi"
          ],
          "description": "Registry containing both package versions"
        },
        "name": {
          "type": "string",
          "minLength": 1,
          "description": "Exact package name, e.g. \"chalk\" or \"urllib3\""
        },
        "from": {
          "type": "string",
          "minLength": 1,
          "description": "Exact currently installed version, e.g. \"4.1.2\""
        },
        "to": {
          "type": "string",
          "minLength": 1,
          "description": "Exact target version, e.g. \"5.0.0\""
        },
        "responseFormat": {
          "type": "string",
          "enum": [
            "full",
            "compact"
          ],
          "default": "full",
          "description": "Use compact to remove repeated prose and fields while retaining evidence; full preserves the legacy response contract"
        }
      },
      "required": [
        "registry",
        "name",
        "from",
        "to"
      ],
      "additionalProperties": false
    },
    "outputSchema": {
      "type": "object",
      "properties": {
        "found": {
          "type": "boolean"
        },
        "packageName": {
          "type": "string"
        },
        "fromVersion": {
          "type": "string"
        },
        "toVersion": {
          "type": "string"
        },
        "breakingCount": {
          "type": "number"
        },
        "advisoryCount": {
          "type": "number"
        },
        "advisories": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": true
          }
        },
        "billed": {
          "type": "boolean"
        },
        "message": {
          "type": "string"
        },
        "scope": {
          "type": "string"
        },
        "tokenMetrics": {
          "type": "object",
          "properties": {
            "fullTokens": {
              "type": "number"
            },
            "compactTokens": {
              "type": "number"
            },
            "savedTokens": {
              "type": "number"
            },
            "reductionPct": {
              "type": "number"
            },
            "encoding": {
              "type": "string",
              "const": "o200k_base"
            }
          },
          "additionalProperties": false
        }
      },
      "additionalProperties": true
    }
  },
  {
    "name": "factreason_api_breaking_changes",
    "description": "Temporarily unavailable for third-party APIs while stored comparisons are revalidated; calls return an unbilled status and alternatives. When restored, this compares optional from/to API versions and returns removed endpoints, parameter changes, and migration notes. Use factreason_package_upgrade_advisory for npm or PyPI packages.",
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": false
    },
    "inputSchema": {
      "type": "object",
      "properties": {
        "service": {
          "type": "string",
          "minLength": 1,
          "description": "Third-party API service, e.g. \"Stripe\" or \"OpenAI\""
        },
        "fromVersion": {
          "type": "string",
          "minLength": 1,
          "description": "Optional exact version currently targeted"
        },
        "toVersion": {
          "type": "string",
          "minLength": 1,
          "description": "Optional exact version being evaluated"
        }
      },
      "required": [
        "service"
      ],
      "additionalProperties": false
    },
    "outputSchema": {
      "type": "object",
      "properties": {
        "found": {
          "type": "boolean"
        },
        "service": {
          "type": "string"
        },
        "billed": {
          "type": "boolean"
        },
        "message": {
          "type": "string"
        },
        "meaning": {
          "type": "string"
        },
        "changeCount": {
          "type": "number"
        },
        "changes": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": true
          }
        },
        "alternatives": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "suggestion": {
          "type": "string"
        }
      },
      "additionalProperties": true
    }
  },
  {
    "name": "factreason_api_schema",
    "description": "Search exact request and response schemas for third-party API endpoints. Pass service alone to list its indexed endpoints, add query to narrow by path or operation, or use query alone across services; returns matches or nearest services. Uses metered access and does not modify source data. Prefer factreason_integration_brief for one callable request.",
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": false
    },
    "inputSchema": {
      "type": "object",
      "properties": {
        "service": {
          "type": "string",
          "minLength": 1,
          "description": "Optional service filter, e.g. \"Stripe\""
        },
        "query": {
          "type": "string",
          "minLength": 1,
          "description": "Optional endpoint path or operation, e.g. \"payment_intents\""
        }
      },
      "additionalProperties": false
    },
    "outputSchema": {
      "type": "object",
      "properties": {
        "found": {
          "type": "boolean"
        },
        "totalMatched": {
          "type": "number"
        },
        "results": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": true
          }
        },
        "message": {
          "type": "string"
        },
        "nearestServices": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "hint": {
          "type": "string"
        }
      },
      "additionalProperties": true
    }
  },
  {
    "name": "factreason_integration_brief",
    "description": "Compile one callable third-party API brief: base URL, auth scheme, required parameters and types, request body, and documented response codes. Service is required and endpoint optionally narrows the operation. Set responseFormat=\"compact\" for tokenizer-measured context savings; the backward-compatible default returns the full brief plus compact form. Uses metered access. Prefer factreason_api_schema when exploring multiple endpoints.",
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": false
    },
    "inputSchema": {
      "type": "object",
      "properties": {
        "service": {
          "type": "string",
          "minLength": 1,
          "description": "Third-party API service, e.g. \"Stripe\" or \"Twilio\""
        },
        "endpoint": {
          "type": "string",
          "minLength": 1,
          "description": "Optional path or operation fragment used to select one call"
        },
        "responseFormat": {
          "type": "string",
          "enum": [
            "full",
            "compact"
          ],
          "default": "full",
          "description": "Use compact for the callable facts only; full preserves the legacy brief response"
        }
      },
      "required": [
        "service"
      ],
      "additionalProperties": false
    },
    "outputSchema": {
      "type": "object",
      "properties": {
        "found": {
          "type": "boolean"
        },
        "billed": {
          "type": "boolean"
        },
        "service": {
          "type": "string"
        },
        "compact": {
          "type": "string"
        },
        "brief": {
          "type": "object",
          "additionalProperties": true
        },
        "tokenMetrics": {
          "type": "object",
          "properties": {
            "fullTokens": {
              "type": "number"
            },
            "compactTokens": {
              "type": "number"
            },
            "savedTokens": {
              "type": "number"
            },
            "reductionPct": {
              "type": "number"
            },
            "encoding": {
              "type": "string",
              "const": "o200k_base"
            }
          },
          "additionalProperties": false
        },
        "message": {
          "type": "string"
        },
        "nearestServices": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "hint": {
          "type": "string"
        }
      },
      "additionalProperties": true
    }
  },
  {
    "name": "factreason_discover_api",
    "description": "Find third-party APIs for a capability when the provider is unknown. Supply a concise capability such as \"sms\" or \"manage DNS\"; returns ranked services, example endpoints, and a next step. Uses metered access. When the provider is already known, call factreason_integration_brief instead.",
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": false
    },
    "inputSchema": {
      "type": "object",
      "properties": {
        "capability": {
          "type": "string",
          "minLength": 2,
          "description": "Capability to search for, e.g. \"send an SMS\" or \"charge a card\""
        }
      },
      "required": [
        "capability"
      ],
      "additionalProperties": false
    },
    "outputSchema": {
      "type": "object",
      "properties": {
        "found": {
          "type": "boolean"
        },
        "billed": {
          "type": "boolean"
        },
        "capability": {
          "type": "string"
        },
        "count": {
          "type": "number"
        },
        "results": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": true
          }
        },
        "message": {
          "type": "string"
        },
        "hint": {
          "type": "string"
        },
        "nextStep": {
          "type": "string"
        }
      },
      "additionalProperties": true
    }
  },
  {
    "name": "factreason_create_topup_link",
    "description": "Create a Stripe Checkout URL for adding prepaid credit to the calling Bearer API key. This creates an external checkout session but does not charge a card. You CANNOT COMPLETE THE PAYMENT YOURSELF, so return the URL to a human, and credit is applied only after they complete payment. Use after HTTP 402 or when balance is low; the tool itself is not metered.",
    "annotations": {
      "readOnlyHint": false,
      "destructiveHint": false,
      "idempotentHint": false,
      "openWorldHint": true
    },
    "inputSchema": {
      "type": "object",
      "properties": {
        "amountUsd": {
          "type": "number",
          "minimum": 1,
          "maximum": 1000,
          "description": "Credit amount in USD; common blocks are 10, 50, and 200"
        }
      },
      "required": [
        "amountUsd"
      ],
      "additionalProperties": false
    },
    "outputSchema": {
      "type": "object",
      "properties": {
        "created": {
          "type": "boolean"
        },
        "amountUsd": {
          "type": "number"
        },
        "checkoutUrl": {
          "type": "string",
          "format": "uri"
        },
        "instructions": {
          "type": "string"
        },
        "balanceUrl": {
          "type": "string",
          "format": "uri"
        },
        "createKeyUrl": {
          "type": "string",
          "format": "uri"
        },
        "error": {
          "type": "string"
        }
      },
      "additionalProperties": true
    }
  },
  {
    "name": "factreason_component_spec",
    "description": "Look up electronics component pin assignments, voltage range, package, and alternatives. Pass exact partNumber for one component or query for a capability search; partNumber takes precedence if both are supplied. For exact lookups, set responseFormat=\"compact\" for tokenizer-measured context savings; the backward-compatible default is \"full\". Uses metered access and returns matches or suggestions. Confirm critical values against the manufacturer datasheet.",
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": false
    },
    "inputSchema": {
      "type": "object",
      "properties": {
        "partNumber": {
          "type": "string",
          "minLength": 1,
          "description": "Exact part number, e.g. \"STM32F401RE\""
        },
        "query": {
          "type": "string",
          "minLength": 1,
          "description": "Free-text capability search, e.g. \"3.3V ARM MCU with SPI\""
        },
        "responseFormat": {
          "type": "string",
          "enum": [
            "full",
            "compact"
          ],
          "default": "full",
          "description": "Use compact for an exact part lookup; full preserves the legacy data response"
        }
      },
      "anyOf": [
        {
          "required": [
            "partNumber"
          ]
        },
        {
          "required": [
            "query"
          ]
        }
      ],
      "additionalProperties": false
    },
    "outputSchema": {
      "type": "object",
      "properties": {
        "found": {
          "type": "boolean"
        },
        "partNumber": {
          "type": "string"
        },
        "totalMatched": {
          "type": "number"
        },
        "compact": {
          "type": "string"
        },
        "provenance": {
          "type": "object",
          "additionalProperties": true
        },
        "qualityScore": {
          "type": "number"
        },
        "data": {
          "type": "object",
          "additionalProperties": true
        },
        "tokenMetrics": {
          "type": "object",
          "properties": {
            "fullTokens": {
              "type": "number"
            },
            "compactTokens": {
              "type": "number"
            },
            "savedTokens": {
              "type": "number"
            },
            "reductionPct": {
              "type": "number"
            },
            "encoding": {
              "type": "string",
              "const": "o200k_base"
            }
          },
          "additionalProperties": false
        },
        "results": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": true
          }
        },
        "nearestMatches": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": true
          }
        },
        "message": {
          "type": "string"
        },
        "hint": {
          "type": "string"
        }
      },
      "additionalProperties": true
    }
  },
  {
    "name": "factreason_deprecation_scan",
    "description": "Scan publisher specifications for deprecated endpoints or parameters, sunset dates, and replacement operations. Omit filters for the catalogue-wide view, pass service to limit one API, and add endpoints to check selected paths. Uses metered access when findings exist. Use factreason_api_breaking_changes for broader version-to-version changes.",
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": false
    },
    "inputSchema": {
      "type": "object",
      "properties": {
        "service": {
          "type": "string",
          "minLength": 1,
          "description": "Optional service filter, e.g. \"Stripe\" or \"Twilio\""
        },
        "endpoints": {
          "type": "array",
          "minItems": 1,
          "items": {
            "type": "string",
            "minLength": 1
          },
          "description": "Optional endpoint paths to check within the selected service"
        }
      },
      "additionalProperties": false
    },
    "outputSchema": {
      "type": "object",
      "properties": {
        "found": {
          "type": "boolean"
        },
        "count": {
          "type": "number"
        },
        "results": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": true
          }
        },
        "message": {
          "type": "string"
        }
      },
      "additionalProperties": true
    }
  },
  {
    "name": "factreason_auth_playbook",
    "description": "Get publisher-declared authentication schemes, scopes, rate-limit headers, and error codes for one third-party API. Returns a structured playbook or nearest service suggestions, and marks undocumented details as unstated rather than guessing. Uses metered access. Prefer factreason_integration_brief when assembling a complete API call.",
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": false
    },
    "inputSchema": {
      "type": "object",
      "properties": {
        "service": {
          "type": "string",
          "minLength": 1,
          "description": "Third-party API service, e.g. \"Stripe\", \"Twilio\", or \"Cloudflare\""
        }
      },
      "required": [
        "service"
      ],
      "additionalProperties": false
    },
    "outputSchema": {
      "type": "object",
      "properties": {
        "found": {
          "type": "boolean"
        },
        "playbook": {
          "type": "object",
          "additionalProperties": true
        },
        "compact": {
          "type": "object",
          "additionalProperties": true
        },
        "message": {
          "type": "string"
        },
        "nearestServices": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      },
      "additionalProperties": true
    }
  },
  {
    "name": "factreason_subscribe_spec_changes",
    "description": "Create a persistent specification watch for one service; a Bearer API key is required and each key may hold up to 50 watches. Without webhookUrl, read future events from the polling endpoint; with a public HTTP(S) URL, FactReason sends signed POST callbacks after later spec changes. Duplicate or unsafe webhook registrations are rejected. This does not ingest a specification immediately.",
    "annotations": {
      "readOnlyHint": false,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    },
    "inputSchema": {
      "type": "object",
      "properties": {
        "serviceName": {
          "type": "string",
          "minLength": 1,
          "maxLength": 200,
          "description": "Service name to watch, e.g. \"Stripe\" or \"SendGrid\""
        },
        "webhookUrl": {
          "type": "string",
          "format": "uri",
          "description": "Optional public HTTP(S) URL for signed change callbacks; omit to poll"
        }
      },
      "required": [
        "serviceName"
      ],
      "additionalProperties": false
    },
    "outputSchema": {
      "type": "object",
      "properties": {
        "success": {
          "type": "boolean"
        },
        "watch": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "serviceName": {
              "type": "string"
            },
            "webhookUrl": {
              "type": "string",
              "format": "uri"
            },
            "createdAt": {
              "type": "string"
            }
          },
          "additionalProperties": true
        },
        "error": {
          "type": "string"
        }
      },
      "additionalProperties": true
    }
  }
];
