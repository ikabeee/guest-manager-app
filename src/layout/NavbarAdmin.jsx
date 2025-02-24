import {
    Navbar,
    NavbarContent,
    Input,
    DropdownTrigger,
    Dropdown,
    Avatar,
  } from "@heroui/react";
import { UserSearchIcon } from "lucide-react";

  
  export default function NavbarAdmin() {
    return (
      <Navbar isBordered>
        <NavbarContent as="div" className="items-center" justify="end">
          <Input
            classNames={{
              base: "max-w-full sm:max-w-ful h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            placeholder="Type to search..."
            size="sm"
            startContent={<UserSearchIcon size={18} />}
            type="search"
            
          />
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </DropdownTrigger>
          </Dropdown>
        </NavbarContent>
      </Navbar>
    );
  }
  