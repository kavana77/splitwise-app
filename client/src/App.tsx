import { RouterProvider } from "react-router-dom";
import router from "./routes";
import ReactQueryProvide from "./providers/reactQueryProvider";

const App = () => {
  return ( 
    <ReactQueryProvide>
      <RouterProvider router={router}/>
    </ReactQueryProvide>
    
   );
}
 
export default App;