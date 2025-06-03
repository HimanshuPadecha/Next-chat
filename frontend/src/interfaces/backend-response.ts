export interface backendResponse<T> {
    response : apiResponse<T>
}

interface apiResponse <T>  {
    data : T,
    statusCode : number,
    message : string,
    success : boolean
}