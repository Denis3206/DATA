import supabase from "../src/config/client"; 
import { useEffect, useState } from "react";


 const Inicio = () => {
    const [fetchError, setFetchError] = useState(null);
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        const fetchAdmin = async () => {
            const { data, error } = await supabase
                .from('admin')
                .select();

            if (error) {
                setFetchError("Error fetching data");
                setAdmin(null);
                console.log("Supabase error:", error.message);
            }

            if (data) {
                setAdmin(data);
                setFetchError(null);
                console.log("Fetched data:", data);
            }
        };

        fetchAdmin();
    }, []);



    return (



     <div className="info">
            {fetchError && <p>{fetchError}</p>}
            {admin && (
                <div className="admin">
                    {admin.map((admi) => <p key={admi.id}>{admi.email}</p> // Asegúrate de que `admi.email` existe en tu base de datos
                    )}
                </div>
            )}


        </div>
);

 }




export default Inicio;

/* const Inicio =()=>{
    console.log(supabase)
    return(
        <div className="hola">
            <h2>home</h2>
        </div>
    )
} */