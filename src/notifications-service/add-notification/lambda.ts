export async function handler(): Promise<any> {
    
    console.log("add todo");

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
            "Cache-Control": "no-cache"
        },
        body: ""
    };    
}