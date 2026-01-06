import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBell, faShield } from "@fortawesome/free-solid-svg-icons";

const Setting = () => {
    return (
        <div className="mt-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-6 focus-visible:outline-none">
            <div className="grid gap-6">
                <div className="rounded-xl border bg-card text-card-foreground border-border shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6 border-b border-border bg-muted/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="font-semibold tracking-tight text-lg">Account Information</div>
                                <div className="text-muted-foreground text-xs">Update your personal details</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 space-y-5">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                                <input className="flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-muted/20 border-border" placeholder="Enter your full name" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                                <input className="flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-muted/20 border-border" type="email" placeholder="Enter your email address" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bio</label>
                            <textarea className="flex min-h-[60px] w-full rounded-md border px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-muted/20 border-border h-24 resize-none" placeholder="Tell us about yourself..." />
                        </div>
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 bg-primary text-primary-foreground border border-primary-border min-h-9 py-2 px-8">Save Changes</button>
                    </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                    <div className="rounded-xl border bg-card text-card-foreground border-border shadow-sm">
                        <div className="flex flex-col space-y-1.5 p-6 pb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                                    <FontAwesomeIcon icon={faBell} className="h-4 w-4" />
                                </div>
                                <div className="font-semibold tracking-tight text-base">Notifications</div>
                            </div>
                        </div>
                        <div className="p-6 pt-0 space-y-4">
                            <div className="flex items-center justify-between py-1">
                                <span className="text-sm font-medium text-foreground">Emails</span>
                                <div className="h-5 w-9 rounded-full relative cursor-pointer transition-colors bg-primary">
                                    <div className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all right-0.5"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-1">
                                <span className="text-sm font-medium text-foreground">Course Updates</span>
                                <div className="h-5 w-9 rounded-full relative cursor-pointer transition-colors bg-primary">
                                    <div className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all right-0.5"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-1">
                                <span className="text-sm font-medium text-foreground">Announcements</span>
                                <div className="h-5 w-9 rounded-full relative cursor-pointer transition-colors bg-muted">
                                    <div className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all left-0.5"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border bg-card text-card-foreground border-border shadow-sm">
                        <div className="flex flex-col space-y-1.5 p-6 pb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-red-500/10 text-red-600">
                                    <FontAwesomeIcon icon={faShield} className="h-4 w-4" />
                                </div>
                                <div className="font-semibold tracking-tight text-base">Privacy &amp; Security</div>
                            </div>
                        </div>
                        <div className="p-6 pt-0 space-y-4">
                            <button className="inline-flex items-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border [border-color:var(--button-outline)] shadow-xs active:shadow-none min-h-8 rounded-md px-3 text-xs w-full justify-start h-10 border-border">Change Password</button>
                            <button className="inline-flex items-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border [border-color:var(--button-outline)] shadow-xs active:shadow-none min-h-8 rounded-md px-3 text-xs w-full justify-start h-10 border-border">Privacy Settings</button>
                            <button className="inline-flex items-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border [border-color:var(--button-outline)] shadow-xs active:shadow-none min-h-8 rounded-md px-3 text-xs w-full justify-start h-10 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">Logout Account</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Setting;