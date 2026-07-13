import { useEffect } from "react"
import { toast } from "sonner"

export default function () {
    useEffect(() => {
        toast.dismiss("Esta página se encontra em desenvolvimento.")
    }, []) 
    
    return (
        <div className="container-main"></div>
    )
}