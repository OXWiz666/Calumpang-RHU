import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { router, useForm, usePage } from "@inertiajs/react";
import axios from "axios";
import InputError from "@/components/InputError";

// UI Components
import { Button } from "@/components/tempo/components/ui/button";
import { Input } from "@/components/tempo/components/ui/input";
import {
    Avatar,
    AvatarFallback,
} from "@/components/tempo/components/ui/avatar";
import { Badge } from "@/components/tempo/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/tempo/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/tempo/components/ui/select";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/tempo/components/ui/dialog";
import DataTable from "react-data-table-component";
import PrimaryButton from "@/components/PrimaryButton";
import DangerButton from "@/components/DangerButton";

import { Pencil, Trash2 } from "lucide-react";
import moment from "moment";
import CreatePageLinks from "@/components/CreatePageLinks";
export default function Mail({ messages }) {
    const [mssgs, setMssgs] = useState(messages.data);

    const { auth } = usePage().props;

    useEffect(() => {
        router.reload({
            only: ["messages"],
        });
    }, [auth]);

    useEffect(() => {
        if (messages) {
            setMssgs(messages.data);

            console.log(mssgs, `length: ${mssgs.length}`);
        }
    }, [messages]);

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    // const [successMessage, setSuccessMessage] = useState(flash?.success || "");
    // const [errorMessage, setErrorMessage] = useState(flash?.error || "");
    // const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
    };
    const columns = [
        {
            name: "User",
            selector: (row) => `${row.user.firstname} ${row.user.lastname}`,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => row.user.email,
            sortable: true,
        },
        {
            name: "Subject",
            selector: (row) => row.subject,
            sortable: true,
        },
        {
            name: "Message",
            selector: (row) => row.message,
            sortable: true,
        },
        {
            name: "Date Created",
            selector: (row) =>
                moment(row.created_at).format("MMM DD YYYY, h:mm a"),
            sortable: true,
        },
        {
            name: "Actions",
            cell: (row) => (
                <>
                    <PrimaryButton>
                        <Pencil />
                    </PrimaryButton>
                    <DangerButton>
                        <Trash2 />
                    </DangerButton>
                </>
            ),
            ignoreRowClick: true,
            button: true,
        },
    ];

    const { links } = usePage().props.messages; // Get pagination links
    return (
        <AdminLayout header="Mail">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2 text-primary">
                        Mail Messages
                    </h2>
                    <p className="text-muted-foreground">
                        See all messages here.
                    </p>
                </div>
                <div className="px-4 md:px-6 py-6 space-y-6">
                    <div className="flex justify-between items-center mb-6">
                        <DataTable
                            columns={columns}
                            data={mssgs}
                            noTableHead={false}
                            responsive={false} // This disables the horizontal scroll
                        />
                        {/* <div>aszxcd</div> */}
                    </div>
                    <CreatePageLinks links={links} />
                </div>
            </motion.div>
        </AdminLayout>
    );
}
