<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PackageController extends Controller
{
    public function index()
    {
        $packages = Package::all();

        return Inertia::render('admin/packages/index', [
            'packages' => $packages,
            'flash'    => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function store(Request $request)
    {

        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'points'   => 'required|integer|min:0',
            'price'    => 'required|decimal:0,2|min:0',
            'duration' => 'required|integer|min:0',
        ]);

        Package::create($validated);

        return redirect()->route('packages.index')->with('success', 'Point option created successfully.');
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'staff_id' => 'required|exists:users,id',
            'name'     => 'required|string|max:255',
            'points'   => 'required|integer|min:0',
            'price'    => 'required|decimal:0,2|min:0',

        ]);

        $option = Package::findOrFail($id);

        $option->update($validated);

        return redirect()->route('packages.index')->with('success', 'Point option updated successfully.');
    }

    public function destroy(string $id)
    {
        $option = Package::findOrFail($id);

        $option->delete();

        return redirect()->route('packages.index')->with('success', 'Point option deleted successfully.');
    }
}
