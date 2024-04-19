# API Gateway Example

This response is a simple example of how to use API Gateway with Lambda. 
The goal of this example is to show how to separate CDK stacks so that different teams have clear lines of responsibility.

## Architecture

This example consists of three stacks (in one stage):

1. `ApiStack` (Base API) - This stack creates an API Gateway RestApi resource and DynamoDB table that is to be shared across different resources (a single table design pattern). It also creates a Route53 record for better access to the API.
2. `OrderStack` (Order API) - This stack creates an 'Order' resource on the API, as well as the POST and GET methods for that resource. It also creates a GSI on the table that is specific to the 'Order' resource.
3. `PersonStack` (Person API) - This stack creates a 'Person' resource on the API, as well as two GET methods for that resource. It also creates a GSI on the table that is specific to the 'Person' resource.

In this case, the work on the Order resource and Person resource can be entirely independent of each other.

## Points of Interest

The following are a few points of interest I suggest you look at:

* The `ApiStack` stack does not specific resources or methods that are used by the Person or Order API. However, GSIs created in the `OrderStack` and `PersonStack`, actually end up in the `ApiStack` stack. This is because the `ApiStack` stack is the one that creates the DynamoDB table and the `.addGlobalSecondaryIndex()` is used, which always adds the GSI to the same stack as the table. This is a limitation of the CDK that you should be aware of.
* The specific API stacks, Order and Person, make public an array of the methods that have been created. This can actually be an array of any type of object. This is used by the ApiStack to force a new Deployment resource if any methods or resources are added to the API stacks. This is largely unnecessary if you are doing a single-stack, but once you start to split the stacks up you need to manually create the Deployment object and added dependencies to it through the `.addToLogicalId()` method. In this case, the Stage is responsible for applying these dependencies.
* The Order and Person APIs are implemented to a small degree. I used a basic three-tier application pattern. While it does work and I would likely advocate for something similar in a production application, it's by no means a requirement. How you implement your handlers is up to you. And yes, I used [aws-lite](https://aws-lite.org/) with these handlers because I wanted to play with it.
* The Order and Person stacks subclass from `RestApiResourceStack` which creates a detached reference to the API. Using this base class makes for less redundant code.
* I've got snapshot tests for the stacks and normal unit tests for the handler code.
