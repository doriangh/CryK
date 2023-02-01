let query = `
    query IntrospectionQuery {
      __schema {
        
        queryType { name }
        mutationType { name }
        subscriptionType { name }
        types {
          ...FullType
        }
        directives {
          name
          description
          
          locations
          args {
            ...InputValue
          }
        }
      }
    }

    fragment FullType on __Type {
      kind
      name
      description
      
      fields(includeDeprecated: true) {
        name
        description
        args {
          ...InputValue
        }
        type {
          ...TypeRef
        }
        isDeprecated
        deprecationReason
      }
      inputFields {
        ...InputValue
      }
      interfaces {
        ...TypeRef
      }
      enumValues(includeDeprecated: true) {
        name
        description
        isDeprecated
        deprecationReason
      }
      possibleTypes {
        ...TypeRef
      }
    }

    fragment InputValue on __InputValue {
      name
      description
      type { ...TypeRef }
      defaultValue
      
      
    }

    fragment TypeRef on __Type {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  `;


function introspectionProvider() {
    return fetch('http://localhost:8082/graphql', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({query: query}),
        credentials: 'include',
    }).then(function (response) {
        return response.text();
    }).then(function (responseBody) {
        try {
          document.getElementById('voyager').style.display = 'block';
            return JSON.parse(responseBody);
        } catch (error) {
            return responseBody;
        }
    });
}

let introspection = introspectionProvider;

if (introspection !== null) {
  GraphQLVoyager.init(document.getElementById('voyager'), {
      introspection: introspection,
      displayOptions: {
          skipRelay: false,
          skipDeprecated: false,
          showLeafFields: true,
      },
      hideDocs: true,
      hideSettings: true,
      hideLoadingBox: true,
  });
}