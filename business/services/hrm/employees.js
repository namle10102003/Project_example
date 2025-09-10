import BaseService from "../base";
import { useEmployeesStore } from '@/stores/business/employee';

class EmployeeService extends BaseService {
  get entity() {
    return "employees";
  }

  async fetch(force = false) {
    const store = useEmployeesStore();
    // Nếu force, xóa cache localStorage để đảm bảo lấy dữ liệu mới và trigger reactive
    if (force && window && window.localStorage) {
      try {
        window.localStorage.removeItem('employees');
      } catch (e) { }
    }
    if (force || shouldFetch(store.employees)) {
      store.setEmployees({ ...store.employees, fetching: true });
      try {
        const response = await this.gets();
        // Nếu force, expired_at = 0 để lần sau luôn fetch mới
        const employees = createCachedEntry(response, force ? -1 : undefined);
        if (force) employees.expired_at = 0;
        store.setEmployees(employees);
      } catch (error) {
        store.setEmployees({ ...store.employees, fetching: false });
        throw error;
      }
    }
  }

  sendInvitation(id) {
    return this.request().post(`${this.entity}/${id}/invite`);
  }

  verify(data) {
    return this.request().post(`${this.entity}/verify`, data);
  }
}

export default new EmployeeService();