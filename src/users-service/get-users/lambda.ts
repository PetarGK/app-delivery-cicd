export async function handler(): Promise<any> {
    const result = [
        {
            id: 1,
            name: "Test",
            description: "Ala bala",
            priority: 1
        },
        {
            id: 2,
            name: "Test 2",
            description: "Ala bala 2",
            priority: 2
        },
        {
            id: 3,
            name: "Test 3",
            description: "Ala bala 3",
            priority: 3
        },     
        {
            id: 4,
            name: "Test 4",
            description: "Ala bala 4",
            priority: 4
        },                    
    ]

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
            "Cache-Control": "no-cache"
        },
        body: JSON.stringify(result)
    };
}