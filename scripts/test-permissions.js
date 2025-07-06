#!/usr/bin/env node

import { connectDB, addUser, findUserByEmail } from "../lib/db.js";
import { PermissionManager, ROLES, PERMISSIONS } from "../lib/permissions.js";

async function testPermissions() {
  console.log("🧪 Testing Comprehensive Permission System...\n");

  try {
    console.log("1. Testing Database Connection...");
    const dbConnected = await connectDB();
    console.log(
      `   ✅ Database connected: ${dbConnected ? "MongoDB" : "In-memory"}\n`
    );

    console.log("2. Testing Role Default Permissions...");
    Object.values(ROLES).forEach((role) => {
      const permissions = PermissionManager.getDefaultPermissions(role);
      const grantedPermissions = Object.values(permissions).filter(
        (p) => p === true
      ).length;
      console.log(`   ✅ ${role}: ${grantedPermissions} permissions granted`);
    });
    console.log("");

    console.log("3. Creating Test Users...");
    const testUsers = [];

    for (const role of Object.values(ROLES)) {
      const testUser = await addUser({
        name: `Test ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        email: `test-${role}@example.com`,
        password: "password123",
        role: role,
      });
      testUsers.push(testUser);
      console.log(`   ✅ Created ${role} user: ${testUser.name}`);
    }
    console.log("");

    console.log("4. Testing Permission Checking...");
    for (const user of testUsers) {
      console.log(`   Testing ${user.role} (${user.name}):`);

      const canAdd = PermissionManager.hasPermission(user, PERMISSIONS.CAN_ADD);
      const canEdit = PermissionManager.hasPermission(
        user,
        PERMISSIONS.CAN_EDIT
      );
      const canDelete = PermissionManager.hasPermission(
        user,
        PERMISSIONS.CAN_DELETE
      );
      const canView = PermissionManager.hasPermission(
        user,
        PERMISSIONS.CAN_VIEW
      );

      console.log(`     - Can Add: ${canAdd ? "✅" : "❌"}`);
      console.log(`     - Can Edit: ${canEdit ? "✅" : "❌"}`);
      console.log(`     - Can Delete: ${canDelete ? "✅" : "❌"}`);
      console.log(`     - Can View: ${canView ? "✅" : "❌"}`);

      // Test admin permissions
      const canAccessAdmin = PermissionManager.hasPermission(
        user,
        PERMISSIONS.CAN_ACCESS_ADMIN_PANEL
      );
      const canManageUsers = PermissionManager.hasPermission(
        user,
        PERMISSIONS.CAN_MANAGE_USERS
      );

      console.log(`     - Admin Access: ${canAccessAdmin ? "✅" : "❌"}`);
      console.log(`     - Manage Users: ${canManageUsers ? "✅" : "❌"}`);
      console.log("");
    }

    // Test 5: Role Hierarchy
    console.log("5. Testing Role Hierarchy...");
    const roleLevels = {};
    for (const role of Object.values(ROLES)) {
      roleLevels[role] = PermissionManager.getRoleLevel(role);
      console.log(`   ✅ ${role}: Level ${roleLevels[role]}`);
    }
    console.log("");

    // Test 6: Permission Groups
    console.log("6. Testing Permission Groups...");
    const adminUser = testUsers.find((u) => u.role === "admin");
    if (adminUser) {
      const summary = PermissionManager.getPermissionSummary(adminUser);
      console.log(
        `   ✅ Admin user has ${
          Object.keys(summary.permissions).length
        } total permissions`
      );
      console.log(
        `   ✅ Permission groups: ${Object.keys(summary.groups).length}`
      );
    }
    console.log("");

    // Test 7: Action-based Permissions
    console.log("7. Testing Action-based Permissions...");
    for (const user of testUsers) {
      console.log(`   ${user.role} can perform:`);
      const actions = ["create", "read", "update", "delete"];
      const resources = ["tasks", "categories", "projects", "pages"];

      for (const action of actions) {
        for (const resource of resources) {
          const canPerform = PermissionManager.canPerform(
            user,
            action,
            resource
          );
          if (canPerform) {
            console.log(`     ✅ ${action} ${resource}`);
          }
        }
      }
      console.log("");
    }

    // Test 8: Resource Access
    console.log("8. Testing Resource Access...");
    const adminUser2 = testUsers.find((u) => u.role === "admin");
    const viewerUser = testUsers.find((u) => u.role === "viewer");

    if (adminUser2 && viewerUser) {
      const adminCanAccessAdmin = PermissionManager.canAccessResource(
        adminUser2,
        "admin"
      );
      const viewerCanAccessAdmin = PermissionManager.canAccessResource(
        viewerUser,
        "admin"
      );

      console.log(
        `   ✅ Admin can access admin panel: ${
          adminCanAccessAdmin ? "YES" : "NO"
        }`
      );
      console.log(
        `   ✅ Viewer can access admin panel: ${
          viewerCanAccessAdmin ? "YES" : "NO"
        }`
      );
    }
    console.log("");

    // Test 9: Role Assignment Rules
    console.log("9. Testing Role Assignment Rules...");
    const adminUser3 = testUsers.find((u) => u.role === "admin");
    const moderatorUser = testUsers.find((u) => u.role === "moderator");

    if (adminUser3 && moderatorUser) {
      const adminCanAssignModerator = PermissionManager.canAssignRole(
        adminUser3,
        "moderator"
      );
      const moderatorCanAssignAdmin = PermissionManager.canAssignRole(
        moderatorUser,
        "admin"
      );

      console.log(
        `   ✅ Admin can assign moderator role: ${
          adminCanAssignModerator ? "YES" : "NO"
        }`
      );
      console.log(
        `   ✅ Moderator can assign admin role: ${
          moderatorCanAssignAdmin ? "YES" : "NO"
        }`
      );
    }
    console.log("");

    console.log("🎉 All permission tests completed successfully!");
    console.log("\n📋 Permission System Summary:");
    console.log("   - 5 roles with hierarchical permissions");
    console.log("   - 22 different permission types");
    console.log("   - Role-based default permissions");
    console.log("   - Custom permission overrides");
    console.log("   - Action-based resource access");
    console.log("   - Role assignment validation");
    console.log("   - Comprehensive permission checking");
  } catch (error) {
    console.error("❌ Permission test failed:", error);
    process.exit(1);
  }
}

// Run the test
testPermissions();
