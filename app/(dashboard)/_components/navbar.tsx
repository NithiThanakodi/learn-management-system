import NavbarRoutes from "@/components/navbar-routes"
import MobileSideBar from "./mobile-sidebar"

const Navbar = () => {
    return (
        <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
            <MobileSideBar />
            <NavbarRoutes />
        </div>
    )
}

export default Navbar