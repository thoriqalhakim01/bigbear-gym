<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportAnalyticController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/report-analytics/index', [
            'trainers' => [],
            'flash'    => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        //
    }

    public function show(string $id)
    {
        //
    }

    public function edit(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}
