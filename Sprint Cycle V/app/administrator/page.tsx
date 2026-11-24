import { FacultyPage } from "../components/RoleHome";
import { StaffList } from "../components/StaffList";
import { canUseRole } from "../lib/access";
import { currentAccount } from "../lib/session";
export const dynamic = "force-dynamic";
export default async function AdministratorPage() {
    const account = await currentAccount();
    const links = [
        { href: "/apply", label: "Apply for a role" },
        { href: "/help", label: "Help" },
        { href: "/#about", label: "About Xpression" },
    ];
    if (canUseRole(account, "administrator")) {
        links.unshift({ href: "/administrator/desk", label: "Open your workspace" });
    }
    return (<FacultyPage kicker="Administrator" title="Administration on Xpression." lede="Administrators look after accounts, role applications, and the shape of the platform. This page is the public introduction. Account tools stay in the administrator workspace." points={[
            "Creator, mentor, and talent scout applications are reviewed before a role login is issued.", "An administrator can activate or deactivate an account.",
            "Platform categories, content rules, and settings are maintained from the same office.",
        ]} links={links}>
 <StaffList id="team" title="Administration team" role="administrator"/>
 </FacultyPage>);
}
